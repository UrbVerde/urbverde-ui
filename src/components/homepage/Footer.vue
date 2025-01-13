<template>
    <div class="footer">
      <div class="newsletter">
        <h4 class="heading-h4">Receba as novidades por e-mail!</h4>
        <div class="form">
          <div class="input-group">
            <input
              type="email"
              class="form-control"
              placeholder="Adicionar seu e-mail"
              aria-label="Adicionar seu e-mail"
              aria-describedby="button-addon2"
            />
            <button class="btn btn-outline-secondary" type="button" id="button-addon2">
              Enviar
            </button>
          </div>
          <p class="body-caption-regular">
            Ao enviar, você concorda em receber e-mails da UrbVerde.
          </p>
        </div>
      </div>
  
      <div class="footer-bottom">
        <router-link to="/mapa" class="button-primary-link">
          <div class="logo-button">
            <img
              src="@/assets/images/logo-urbverde-white.svg"
              width="39px"
              height="40px"
              alt="Logo da UrbVerde"
            />
            <p class="body-small-medium">&copy; UrbVerde, 2025.</p>
          </div>
        </router-link>
  
        <div class="links body-small-medium">
          <router-link to="/mapa">Plataforma</router-link>
          <a
            href="https://urbverde-educa.tawk.help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            UrbVerde Educa
          </a>
          <a
            href="https://urbverde-educa.tawk.help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contatos
          </a>
          <a
            href="https://urbverde-educa.tawk.help/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Termos de uso
          </a>
        </div>
  
        <div class="midias">
          <a href="http://wa.me/5511916709802" target="_blank" rel="noopener noreferrer">
            <img
              src="@/assets/images/homepage/media-links/media-link-01.svg"
              alt="WhatsApp Link"
            />
          </a>
          <a href="mailto:comunica.urbverde@usp.br" target="_blank" rel="noopener noreferrer">
            <img
              src="@/assets/images/homepage/media-links/media-link-02.svg"
              alt="E-mail Link"
            />
          </a>
          <a
            href="https://instagram.com/urb.verde"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="@/assets/images/homepage/media-links/media-link-03.svg"
              alt="Instagram Link"
            />
          </a>
          <a
            href="https://www.linkedin.com/company/urbverde/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="@/assets/images/homepage/media-links/media-link-04.svg"
              alt="LinkedIn Link"
            />
          </a>
          <a
            href="https://www.youtube.com/@urb_verde"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="@/assets/images/homepage/media-links/media-link-05.svg"
              alt="Youtube Link"
            />
          </a>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "Footer",
  };
  </script>
  
  <style scoped lang="scss">
  a{
    text-decoration: none;
  }
  
  .footer {
    display: flex;
    padding: 0px 80px;
    background: linear-gradient(180deg, #146c43 0%, #0f5132 100%);
    flex-direction: column;
    align-items: flex-start;
    align-self: stretch;
  }
  
  .footer .newsletter {
    display: flex;
    height: 237px;
    padding: 48px 0px 56px 0px;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    flex-shrink: 0;
    align-self: stretch;
  }
  
  .footer .newsletter h4 {
    font-weight: 700;
    text-align: center;
    color: map-get($gray, white);
    padding: 0;
    margin: 0;
  }
  
  .footer .newsletter .form {
    display: flex;
    width: 498px;
    height: 64px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-end;
    gap: 12px;
    flex-shrink: 0;
  }
  
  .footer .newsletter .form p {
    color: map-get($gray, white);
    margin: auto;
    padding: 0;
    text-align: center;
  }
  
  .footer .footer-bottom {
    display: flex;
    padding: 32px 24px;
    align-items: center;
    gap: 24px;
    align-self: stretch;
    justify-content: space-between;
  }
  
  .footer .footer-bottom .logo-button {
    display: flex;
    align-items: center;
    gap: 12px;
    color: map-get($gray, white);
  }
  
  .footer .footer-bottom .links {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex: 1 0 0;
  }
  
  .footer .footer-bottom .links a {
    color: map-get($gray, white);
  }
  
  .footer .footer-bottom .midias {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  .footer .footer-bottom .midias img {
    width: 36px;
    height: 36px;
  }
  </style>
  