// TO ADD : (1) THE SCREEN SHOULD BE ABLE TO ACCOMODATE THE 
//              TOTAL INPUT/CONVERSION OUTPUT WITHOUT
//              OVERFLOWING ITS BORDER
document.addEventListener('DOMContentLoaded', () => {
    const amount = document.querySelector('#amount'),
     exchange = document.querySelector('#exchange'),
     convertFrom = document.querySelector('#convert-from').value,
     convertTo = document.querySelector('#convert-to').value;
     console.log(`${convertFrom} & ${convertTo}`);
     
     const rates = () => {
        // ***************       TODO       ****************
        //DISPLAY A MESSAGE TO INDICATE ABSEBCE OF CONVERSION
        //RATES 'if' CONVERSION RATES ARE NOT YET SELECTED OR 
        //JUST ONE RATE IS SELECTED.
        
        //if(convertFrom === convertTo || convertFrom === null || convertTo ===null)

        //      DO THIS ONLY WHEN ALL CONVERSION RATES ARE SELECTED
        return fetch(`currencyconverterapi.com/${convertFrom}+${convertTo}`).then(response => {
          //UPDATE THE EXCHANGE RATE
        });
    };
    
    //  QUICKLY APPLY CONVERSION RATE CHANGES
    const screenForms = document.querySelectorAll('.screen-forms');
    screenForms.forEach(form => {
        form.onchange = rates;
    });

    const buttons = document.querySelectorAll('.input-btn');
    buttons.forEach(button => {
        button.onclick = () => {
          if(!button.textContent.includes('del'))
            amount.textContent += button.textContent;
          else
            amount.textContent = amount.textContent.slice(0, -1);
            
        if(amount.textContent.length < 1){
                return exchange.textContent = '';
            };
          
          let amt = amount.textContent;
          exchangeRate = fetch();
          exchange.textContent = exchangeRate * amt
        };
    });
});


if(navigator.serviceWorker){
navigator.serviceWorker.register('sw.js').then(reg => {
  console.log('success')
  if (!navigator.serviceWorker.controller){
    return;
  }

  if(reg.waiting){
    //TODO
    //Show notification for updates
  }

  if(reg.installing){
    //TODO
    //Track Installation and show notification when updates are ready
  }

  reg.installing.addEventListener('updatefound', event => {
    console.log(event);
  });
}).catch(err => {
    console.log('failed to register');
  });
}

navigator.serviceWorker.controller.addEventListener('controllerchange', event => {

});