import React, { useState, useMemo, useRef } from "react";
import { motion } from "framer-motion";
import facultyData from "../Constants/FacultyData";

const getDesignationColor = (designation) => {
  if (!designation) return "text-gray-400";
  if (/director|principal|head|hod|dean/i.test(designation))
    return "text-emerald-400";
  if (/professor|associate|assistant/i.test(designation))
    return "text-yellow-300";
  return "text-gray-400";
};

const renderHighlighted = (text, q) => {
  const str = (text ?? "").toString();
  if (!q) return str;
  const lower = str.toLowerCase();
  const qLower = q.toLowerCase();
  const parts = [];
  let lastIndex = 0;
  let idx = lower.indexOf(qLower, lastIndex);
  let key = 0;
  while (idx !== -1) {
    if (idx > lastIndex) parts.push(str.slice(lastIndex, idx));
    parts.push(
      <span key={key++} className="bg-emerald-400/20 text-emerald-200 px-1 rounded-sm">
        {str.slice(idx, idx + qLower.length)}
      </span>
    );
    lastIndex = idx + qLower.length;
    idx = lower.indexOf(qLower, lastIndex);
  }
  if (lastIndex < str.length) parts.push(str.slice(lastIndex));
  return parts;
};

const Faculty = () => {
  const [query, setQuery] = useState("");
  const firstCardRef = useRef(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return facultyData;
    return facultyData.filter((f) => {
      const name = (f["Name of the Faculty"] || "").toString().toLowerCase();
      const designation = (f.Designation || "").toString().toLowerCase();
      const mail = (f["mail ID"] || "").toString().toLowerCase();
      const emp = (f["Emp ID"] || "").toString().toLowerCase();
      return (
        name.includes(q) ||
        designation.includes(q) ||
        mail.includes(q) ||
        emp.includes(q)
      );
    });
  }, [query]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Scroll first result into view to show 'output'
    if (firstCardRef.current) {
      firstCardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      firstCardRef.current.focus?.();
    }
  };

  return (
    <div className="w-full min-h-screen bg-black text-white py-12">
      <div className="container mx-auto px-4">
        {/* Search bar aligned top-right but slightly lower */}
        <form onSubmit={handleSubmit} className="flex items-center justify-end mt-[34px] mb-8">
          <input
            aria-label="Search faculty"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, designation, email or ID"
            spellCheck={false}
            autoComplete="off"
            className="w-full sm:w-64 bg-gray-800/60 text-white placeholder-gray-400 rounded-full px-4 py-2 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          />
          <button
            type="submit"
            aria-label="Submit search"
            className="ml-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/10"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z" />
            </svg>
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full text-center text-gray-400 py-8">
              No faculty found.
            </div>
          ) : (
            filtered.map((faculty, idx) => {
              const isFirst = idx === 0;
              return (
                <motion.div
                  key={idx}
                  ref={isFirst ? firstCardRef : undefined}
                  tabIndex={isFirst ? -1 : undefined}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.3 }}
                  className="relative bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-emerald-500/10 hover:border-emerald-500/30 overflow-hidden shadow-md transition-all duration-500 p-6 min-h-[260px]"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-white mb-1">
                      {renderHighlighted(faculty["Name of the Faculty"], query)}
                    </h3>
                    <p
                      className={`text-sm font-medium ${getDesignationColor(
                        faculty.Designation
                      )} tracking-wide`}
                    >
                      {renderHighlighted(faculty.Designation, query)}
                    </p>
                  </div>

                  <div className="mt-4 text-sm space-y-2">
                    {/* Employee ID */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                        Employee ID
                      </p>
                      <p className="text-white/90 font-mono text-sm">
                        {renderHighlighted(String(faculty["Emp ID"] || ""), query)}
                      </p>
                    </div>

                    {/* Email */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                        Email Address
                      </p>
                      <a
                        href={`mailto:${faculty["mail ID"]}`}
                        className="text-white/90 hover:text-emerald-400 transition-colors duration-200 block text-sm truncate"
                      >
                        {renderHighlighted(faculty["mail ID"], query)}
                      </a>
                    </div>

                    {/* Location Info */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">
                        Location
                      </p>
                      <div className="flex items-center space-x-4 text-sm">
                        <span className="text-white/90">
                          Room {faculty["Room No"] || "N/A"}
                        </span>
                        <span className="text-gray-600">•</span>
                        <span className="text-white/90">
                          Cabin {faculty["Cabin No"] || "N/A"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Hover indicator */}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                    initial={{ opacity: 0, scaleX: 0 }}
                    whileHover={{ opacity: 1, scaleX: 1 }}
                    transition={{ duration: 0.4 }}
                  />
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Faculty;