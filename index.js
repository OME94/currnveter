/* 
TO ADD : (1) THE SCREEN SHOULD BE ABLE TO ACCOMODATE THE 
              TOTAL INPUT/CONVERSION OUTPUT WITHOUT
              OVERFLOWING ITS BORDER
*/
window.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  const convertTo = document.querySelector('#convert-to');
  const convertFrom = document.querySelector('#convert-from');
    
  
  const rates = () => {
    // ***************       TODO       ****************
    //DISPLAY A MESSAGE TO INDICATE ABSENCE OF CONVERSION
        const apis = {
          fixer: {
            key: '4ef21a789fe4c083e06322f19d53395d',
            endpoints: {
              latest: `https://data.fixer.io/api/latest?access_key=4ef21a789fe4c083e06322f19d53395d`,
              /*
              history: `http://data.fixer.io/api/${year}-${month}-${day}?access_key=4ef21a789fe4c083e06322f19d53395d&symbols=${symbols}`,
              convert: `http://data.fixer.io/api/convert?access_key=4ef21a789fe4c083e06322f19d53395d&from=${convertFrom}&to=${convertTo}&amount=${amount}`,
              histConvert: `http://data.fixer.io/api/convert?access_key=4ef21a789fe4c083e06322f19d53395d&from=${convertFrom}&to=${convertTo}&amount=${amount}&date=${year}-${month}-${day}`,
              timeseries: `http://data.fixer.io/api/timeseries?access_key=4ef21a789fe4c083e06322f19d53395d&start_date=${start_year}-${start_month}-${start_day}&end_date=${end_year}-${end_month}-${end_day}&base=${base}&symbols=${symbols}`
              */
            }
          },
          currconv: {
            key: '887c2d2a138031828c49',
            url: `https://free.currconv.com/api/v7/convert?q=${convertFrom.value}_${convertTo.value}&compact=ultra&apiKey=887c2d2a138031828c49`
          }
        };
    //RATES 'if' CONVERSION RATES ARE NOT YET SELECTED OR 
    //JUST ONE RATE IS SELECTED.
    
    //if(convertFrom === convertTo || convertFrom === null || convertTo ===null)
    
    //      DO THIS ONLY WHEN ALL CONVERSION RATES ARE SELECTED
    return fetch(apis.currconv.url).then(
      response => response.json()
      ).then(data => {
        console.log(data);
        const amount = document.querySelector('#amount').textContent;
        const exchange = document.querySelector('#exchange');
        const value = data[`${convertFrom.value}_${convertTo.value}`];
        exchange.textContent = amount * value
      }).catch(error => {
        console.log(error);
        fetch(api.fixer.endpoints.latest).then(
          response => response.json()
          ).then({rates} => {
            console.log(`fixer: ${rates}`);
            const amount = document.querySelector('#amount').textContent;
            const exchange = document.querySelector('#exchange');
            const val = convertTo.value;
            
            exchange.textContent = amount * rates[`${val}`];
          });
      });
    };
    
    //  QUICKLY APPLY CONVERSION RATE CHANGES
    const screenForms = document.querySelectorAll('.screen-forms');
    const forEach = Array.prototype.forEach;
    forEach.call(screenForms, form => {
      form.onchange = rates;
    });
    
    const buttons = document.querySelectorAll('.input-btn');
    forEach.call(buttons, button => {
      button.onclick = () => {
        if(!button.textContent.includes('del'))
          amount.innerHTML += button.textContent;
        else
          amount.textContent = amount.textContent.slice(0, -1);
        
        if(amount.textContent.length < 1)
          return exchange.textContent = '';

        rates();
    };
  });
});

/*
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

});*/