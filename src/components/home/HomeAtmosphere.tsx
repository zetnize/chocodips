import Image from "next/image";

export default function HomeAtmosphere() {
  return (
    <section className="home-atmosphere container" aria-labelledby="atmosphere-title">
      <div className="home-atmosphere-copy">
        <h2 id="atmosphere-title">Можно никуда<br />не спешить</h2>
        <p>
          Встретиться за кофе. Обсудить всё на свете. Или просто сделать
          паузу посреди дня — с любимым напитком и чем-нибудь сладким.
        </p>
        <p>Заглядывайте вдвоём, с друзьями или наедине с собой.</p>
      </div>
      <figure className="home-atmosphere-coffee">
        <div className="home-atmosphere-photo">
          <Image
            src="/images/gallery-4.jpg"
            alt="Два кофе с латте-артом на деревянном столе в солнечном свете"
            fill
            sizes="(max-width: 640px) 88vw, (max-width: 1023px) 48vw, 620px"
          />
        </div>
        <figcaption>Два кофе и время поговорить</figcaption>
      </figure>
      <figure className="home-atmosphere-dessert">
        <div className="home-atmosphere-photo">
          <Image
            src="/images/gallery-2.jpg"
            alt="Десерт с яблоками, крамблом, сливками и карамельным соусом"
            fill
            sizes="(max-width: 640px) 60vw, (max-width: 1023px) 30vw, 350px"
          />
        </div>
        <figcaption>И что-нибудь сладкое</figcaption>
      </figure>
    </section>
  );
}
