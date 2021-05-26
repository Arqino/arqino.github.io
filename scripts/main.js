miro.onReady(() => {

      miro.initialize({
        extensionPoints: {
          bottomBar: {
            title: 'CSV to Cards',
            svgIcon: '<svg width="19" height="24" viewBox="0 0 19 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M16.625 4H2.37496C1.50051 4 0.791626 4.89543 0.791626 6V18C0.791626 19.1046 1.50051 20 2.37496 20H16.625C17.4994 20 18.2083 19.1046 18.2083 18V6C18.2083 4.89543 17.4994 4 16.625 4Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H18.4167" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 22V14" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.70837 17L9.50004 13.5L13.2917 17" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0"><rect width="19" height="24" fill="white"/></clipPath></defs></svg>',
            onClick: () => {
              miro.board.ui.openLeftSidebar('arqino-form.html');
            }
          }
        }
      })
    })