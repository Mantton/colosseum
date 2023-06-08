const NavLink = ({ link, title }: { title: string; link: string }) => {
  return (
    <li className="hidden md:block">
      <a
        href={link}
        target="_blank"
        className="flex items-center px-3 py-2 font-medium transition duration-150 ease-in-out text-zinc-500 hover:text-zinc-800 lg:px-5"
      >
        {title}
      </a>
    </li>
  );
};

export default NavLink;
