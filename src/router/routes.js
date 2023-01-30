import { routes as Home } from "@/modules/Home";
import { routes as Mapa } from "@/modules/Mapa";
import { routes as Contato } from "@/modules/Contato";
import { routes as Sobre } from "@/modules/Sobre";

export default [...Mapa, ...Home, ...Contato, ...Sobre];
