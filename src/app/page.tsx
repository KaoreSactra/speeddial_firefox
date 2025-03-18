import containers from "@/json/containers.json"

export default function Home() {

  return (
    <main className="w-dvw h-dvh flex justify-center items-center px-[14dvw] bg-primary">
      <img src="/img/bg/bg_2.png" className="fixed z-10 w-dvw h-dvh object-cover select-none pointer-events-none" draggable="false"/>
        <ul className="grid grid-cols-4 gap-10 z-20">
          {containers.map((item) => (
            <li key={item.id} className="min-h-[100px] min-w-[150px] rounded-lg hover:scale-106 transition duration-300 ease-in-out shadow-custom">
              <a href={item.url} draggable="false">
                <img src={item.img} alt={item.name} className="rounded-lg select-none pointer-events-none" draggable="false"/>
              </a>
            </li>
          ))}
        </ul>
    </main>
  )
}
