const Messages = ({ userId, chat }) => {
  return (
    <div
      className=" text-discord-gray 
                hover:bg-discord-black/25
                dark:hover:bg-discord-black/50 px-4
               dark:text-white py-1
               flex flex-row gap-2 "
    >
      {/* {chat} */}
      <div className="w-[40px] h-[40px] flex flex-col items-center justify-center ">
        <img
          src="https://plus.unsplash.com/premium_photo-1689539137236-b68e436248de?q=80&w=2071&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="profile picture"
          className="object-cover h-full w-full rounded-full"
        />
      </div>
      <div className="flex flex-col">
        <span className="font-semibold">{userId}</span>
        <span className="font-normal">{chat}</span>
      </div>
    </div>
  );
};

export default Messages;
