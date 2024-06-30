export default [
  {
    path: "/mapa",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "Mapa",
        path: "/mapa/SP/:id?/:escala?/:ano?/:categoria?/:variavel?",
        component: () => import("@/views/MapaView"),
      },
    ],
  },
];
