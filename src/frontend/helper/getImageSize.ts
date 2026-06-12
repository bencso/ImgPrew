export const getImageSize = (
  url: string,
): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      const { width, height } = img;

      img.onload = null;
      img.onerror = null;

      resolve({
        width: width || 300,
        height: height || 300,
      });
    };

    img.onerror = () => {
      img.onload = null;
      img.onerror = null;

      reject({
        width: 0,
        height: 0,
      });
    };

    img.src = url;
  });
};
