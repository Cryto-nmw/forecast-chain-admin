import Image from "next/image";
import LoadingGif from "@/assets/animation/loading-101.gif";
export const Spinner = () => {
  return (
    <>
      <Image src={LoadingGif} alt="Loading" width={35} />
    </>
  );
};
