import containers from "@/json/containers.json"

export default function Home() {

  return (
    <main className="w-dvw h-dvh flex justify-center items-center px-[10dvw]">
        <ul className="grid grid-cols-4 gap-10">
          {containers.map((item) => (
            <li key={item.id} className="hover:scale-106 transition duration-300 ease-in-out">
              <a href={item.url}>
                <img src={item.img} alt={item.name} className="rounded-lg"/>
              </a>
            </li>
          ))}
        </ul>
    </main>
  )
}
