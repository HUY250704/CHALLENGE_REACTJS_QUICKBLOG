import Lottie from "lottie-react";
import emptySearchAnimation from "@/assets/empty-search.json";

export default function Animation({ className = "" }) {
  return (
    <Lottie
      animationData={emptySearchAnimation}
      loop
      aria-hidden="true"
      className={className}
    />
  );
}
