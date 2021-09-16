/* 
TO ADD : (1) THE SCREEN SHOULD BE ABLE TO ACCOMODATE THE 
              TOTAL INPUT/CONVERSION OUTPUT WITHOUT
              OVERFLOWING ITS BORDER
*/
window.addEventListener('DOMContentLoaded', () => {
  const convertTo = document.querySelector('#convert-to');
  const convertFrom = document.querySelector('#convert-from');
  
  const rates = {};
  const getRate = () => {
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
    
    const amount = document.querySelector('#amount').textContent;
    const quote = document.querySelector('#quote');
    const pair = `${convertFrom.value}_${convertTo.value}`
    
    //      DO THIS ONLY WHEN ALL CONVERSION RATES ARE SELECTED
    if(rates[pair]){
      quote.textContent = amount * rates[pair];
      return;
    }
    else{
      return fetch(apis.currconv.url).then(
      response => response.json()
      ).then(data => {
        console.log(data);
        const value = data[pair];
        rates[pair] = value;
        quote.textContent = amount * value
      });//.catch(error => {
      //   console.log(error);
      //   fetch(api.fixer.endpoints.latest).then(
      //     response => response.json()
      //     ).then(({rates}) => {
      //       console.log(`fixer: ${rates}`);
      //       const val = convertTo.value;
            
      //       quote.textContent = amount * rates[`${val}`];
      //     });
      // });
    }
  };
    
  //  QUICKLY APPLY CONVERSION RATE CHANGES
  const screenForms = document.querySelectorAll('.screen-forms');
  const forEach = Array.prototype.forEach;
  forEach.call(screenForms, form => {
    form.onchange = getRate;
  });
  
  const buttons = document.querySelectorAll('#buttons > button');
  forEach.call(buttons, button => {
    button.onclick = () => {
      if(!button.textContent.includes('del'))
        amount.innerHTML += button.textContent;
      else
        amount.textContent = amount.textContent.slice(0, -1);
      
      if(amount.textContent.length < 1)
        return quote.textContent = '';

      getRate();
    };
  });
});


if(navigator.serviceWorker){
  navigator.serviceWorker.register('sw.js').then(reg => {
    console.log('sw reg success')
    if (!navigator.serviceWorker.controller) return;

        // TODO
        // Show notification for updates
    if(reg.waiting){
      updateSw(reg.waiting);
      console.log('waiting sw updated');
      return;
    }

    if(reg.installing){
      trackSw(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', event => {
      console.log(event);
      trackSw(reg.installing);
    });
  }).catch(err => {
    console.log('failed to register', err);
  });
}

navigator.serviceWorker.controller.addEventListener('controllerchange', event => {
  console.log(event);
  window.location.reload();
});

function trackSw(sw){
  sw.addEventListener('statechange', function(event){
    console.log(event);
    if(this.state == 'installed') updateSw(this);
    
    console.log('updated')
  });
}

function updateSw(sw){
  sw.postMessage({action: 'skipWaiting'});
}