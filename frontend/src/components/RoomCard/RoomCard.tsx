const RoomCard = () => {
  return (
    <article
      className={`grid justify-stretch items-center gap-3 transition-all hover:bg-secondary rounded-lg p-4 grid-cols-[auto_1fr] hover:cursor-pointer`}
    >
      <div
        className="bg-cover bg-center bg-no-repeat w-13 h-13 rounded-full"
        style={{
          backgroundImage: `url('https://media-hbe1-1.cdn.whatsapp.net/v/t61.24694-24/511052883_735092402815370_8665970676075279607_n.jpg?ccb=11-4&oh=01_Q5Aa3QGL-c_E1z8AKVMG5yTkTDRvE0P7dUovefZqY-XgKzvhqQ&oe=6950F880&_nc_sid=5e03e0&_nc_cat=104')`,
        }}
      ></div>
      <div className="grid justify-stretch items-center gap-2">
        <div className="flex justify-between items-center gap-1">
          <h6 className="text-md line-clamp-1 text-white font-normal">
            Mahmoud Salama adasdasda adadasd
          </h6>
          <p className="bg-primary py-0.5 px-1 font-medium text-white rounded-full text-sm">12</p>
        </div>
        <p className="text-sm text-txt line-clamp-1">عامل ايه</p>
      </div>
    </article>
  );
};

export default RoomCard;
