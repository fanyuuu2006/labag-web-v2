import { PlayButton } from "./PlayButton";

export const MainSection = () => {
  return (
    <section className={"h-full"}>
      <div className="container h-full flex flex-col items-center justify-center">
        <PlayButton />
      </div>
    </section>
  );
};