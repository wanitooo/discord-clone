import { ChangeEvent } from "react";

const UploadAddServerIcon = ({
  image,
  onImageChange,
}: {
  image: string | null;
  onImageChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  //   const [image, setImage] = useState<string | null>(null);

  //   const onImageChange = (event: ChangeEvent<HTMLInputElement>): void => {
  //     const input = event.target as HTMLInputElement;

  //     if (input.files !== null && input.files.length) {
  //       const file = input.files[0];
  //       const url = URL.createObjectURL(file);
  //       setImage(url);
  //     }
  //   };
  const Display = {
    NoImage: (
      <>
        {/* TODO: Make it better, more reflective of actual discord upload area */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 256 256"
          id="circle-dashed"
          className="group-hover:cursor-pointer"
        >
          <rect width="256" height="256" fill="none"></rect>
          <path
            fill="none"
            stroke="#000"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="12"
            d="M35.25567 103.14925a95.55835 95.55835 0 0 1 24.86208-43.0315M60.10646 195.89357a95.55822 95.55822 0 0 1-24.83534-43.04694M152.85078 220.74432a95.55827 95.55827 0 0 1-49.69741-.01544M220.74433 152.85075a95.55835 95.55835 0 0 1-24.86208 43.0315M195.89354 60.10643a95.55822 95.55822 0 0 1 24.83534 43.04694M103.14922 35.25568a95.55827 95.55827 0 0 1 49.69741.01544"
          ></path>
        </svg>
        <span className="uppercase font-bold text-xs absolute -z-10">
          Upload
        </span>
      </>
    ),
    PreviewedImage: (
      <>
        <img
          src={image}
          alt="uploaded image"
          className={`${
            image == null
              ? "hidden"
              : " group-hover:cursor-pointer rounded-full w-full h-full"
          }`}
        />
      </>
    ),
  };
  return (
    <div className="w-28 h-28 group inline-block relative ">
      <input
        type="file"
        id="upload"
        accept="image/*"
        onChange={(event) => onImageChange(event)}
        className="hidden"
      />
      <label
        htmlFor="upload"
        className="flex flex-row items-center justify-center w-full h-full rounded-full"
      >
        {/* <div className="w-full h-full bg-green-400 rounded-full outline-dashed outline-offset-8 outline-black " /> */}
        {Display[image == null ? "NoImage" : "PreviewedImage"]}
      </label>
    </div>
  );
};

export default UploadAddServerIcon;
