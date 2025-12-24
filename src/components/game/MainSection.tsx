import { PlayButton } from "./PlayButton";

export const MainSection = () => {
  return (
    <section className="h-full min-h-[80vh] flex flex-col items-center justify-center py-12">
      <div className="container flex flex-col items-center justify-center">
        <PlayButton />
      </div>
    </section>
  );
};