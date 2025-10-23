import { useRef } from "react";

export const useInfiniteScroll = (callback) => {
  const observer = useRef();

  const lastElementRef = (node) => {
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        callback();
      }
    });

    if (node) observer.current.observe(node);
  };

  return lastElementRef;
};
