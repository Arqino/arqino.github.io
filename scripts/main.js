// var selectedWidgets1;

miro.onReady(() => {



      miro.initialize({
        extensionPoints: {
          toolbar: {
            title: 'CSV to Cards',
            librarySvgIcon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M16.625 4H2.37496C1.50051 4 0.791626 4.89543 0.791626 6V18C0.791626 19.1046 1.50051 20 2.37496 20H16.625C17.4994 20 18.2083 19.1046 18.2083 18V6C18.2083 4.89543 17.4994 4 16.625 4Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H18.4167" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 22V14" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.70837 17L9.50004 13.5L13.2917 17" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>',
            toolbarSvgIcon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0)"><path d="M16.625 4H2.37496C1.50051 4 0.791626 4.89543 0.791626 6V18C0.791626 19.1046 1.50051 20 2.37496 20H16.625C17.4994 20 18.2083 19.1046 18.2083 18V6C18.2083 4.89543 17.4994 4 16.625 4Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M1 10H18.4167" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M9.5 22V14" stroke="black" stroke-linecap="round" stroke-linejoin="round"/><path d="M5.70837 17L9.50004 13.5L13.2917 17" stroke="black" stroke-linecap="round" stroke-linejoin="round"/></g><defs><clipPath id="clip0"><rect width="24" height="24" fill="white"/></clipPath></defs></svg>',//'<circle cx="12" cy="12" r="9" fill="red" fill-rule="evenodd" stroke="currentColor" stroke-width="2"/>',
            onClick: async () => {
                const authorized = await miro.isAuthorized()
                if (authorized) {
                    miro.board.ui.openLeftSidebar('../form.html')
                } else {
                    miro.board.ui.openModal('../not-authorized.html')
                    .then(res => {
                        if (res === 'success') {
                            miro.board.ui.openLeftSidebar('../form.html')
                        }
                    })
                }
            }

            //() => {
              //miro.board.ui.openLeftSidebar('../form.html');
            //}
          }
        }
      })

      // miro.addListener('SELECTION_UPDATED', selectedWidgets(widget));
    //   miro.addListener('SELECTION_UPDATED', widget => {
    //     console.log(widget.data);
    //     // let selectedCardsText = document.getElementById('selected-cards');
    //     // selectedCardsText.innerHTML = widget.data.length;
    //     // selectedWidgets1 = widget.data;
    //     window.selectedWidgets = widget.data;
    // })

    })
