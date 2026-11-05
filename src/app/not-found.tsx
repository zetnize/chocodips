import ArrowLink from "@/components/ui/ArrowLink";
import Eyebrow from "@/components/ui/Eyebrow";
export default function NotFound() {
  return (
    <section className="simple-page container">
      <Eyebrow>ОШИБКА 404</Eyebrow>
      <h1>
        Кажется, здесь
        <br />
        всё уже съели.
      </h1>
      <p>Такой страницы нет. А кофе и десерты — есть.</p>
      <ArrowLink href="/">Вернуться на главную</ArrowLink>
    </section>
  );
}
