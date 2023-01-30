export default [
  {
    path: "/mapa",
    component: () => import("@/layout/Default"),
    children: [
      {
        name: "Mapa",
        path: "/mapa/:id?/:escala?/:ano?/:categoria?/:variavel?/:setorid?",
        component: () => import("@/views/MapaView"),
      },
    ],
  },
];
