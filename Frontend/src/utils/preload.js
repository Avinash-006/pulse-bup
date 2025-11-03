export const decodeImageElement = (img) => {
  if (!img) return Promise.resolve();
  if (img.complete && img.naturalWidth > 0) {
    try {
      return img.decode ? img.decode() : Promise.resolve();
    } catch (_) {
      return Promise.resolve();
    }
  }
  return new Promise((resolve) => {
    const onDone = () => {
      img.removeEventListener('load', onDone);
      img.removeEventListener('error', onDone);
      resolve();
    };
    img.addEventListener('load', onDone, { once: true });
    img.addEventListener('error', onDone, { once: true });
  }).then(() => {
    try {
      return img.decode ? img.decode() : undefined;
    } catch (_) {
      return undefined;
    }
  });
};

export const waitForCriticalImages = (selectors = ['img[data-preload="critical"]'], timeoutMs = 6000) => {
  const imgs = selectors.flatMap((sel) => Array.from(document.querySelectorAll(sel)));
  const unique = Array.from(new Set(imgs));
  const work = Promise.all(unique.map((i) => decodeImageElement(i)));
  const timeout = new Promise((resolve) => setTimeout(resolve, timeoutMs));
  return Promise.race([work, timeout]);
};


