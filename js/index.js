const rates = {};
const allCountries = fetch('https://restcountries.com/v3.1/all/?fields=currencies,flag,name').then(
  res => res.json()
);

window.addEventListener('DOMContentLoaded', () => {
  console.log('loaded');
  
  const currList = document.querySelector('#currencies');
  allCountries.then(countries => {
    let listOptions = ''
    for (let country of countries){
      let {currencies, flag, name} = country;
      let currencyCodes = Object.keys(currencies);
      if (currencyCodes.length < 1) console.log(`NO currency: ${name.official}`);

      if (currencyCodes.length){
        if (currencyCodes.length > 1) console.log(currencies);
  
        let currencyCode = currencyCodes[0];
        let { symbol } = currencies;
        let currencyName = currencies[currencyCode].name;
  
        listOptions += `<option value="${currencyCode}"><span>${flag}</span> ${currencyName}</option>`;
      }
    }
    return listOptions;
  }).then(
    options => currList.insertAdjacentHTML('beforeend', options)
  ).catch(
    err => toast(`Countries API Unavailable\n${err}`)
  );

  const convertFrom = document.querySelector('#convert-from').value;
  const convertTo = document.querySelector('#convert-to').value;

  const exchangeDiv = document.querySelector('#exchange');
  const amountDiv = document.querySelector('#amount');
  let amount = amountDiv.textContent;
  
  //      DO THIS ONLY WHEN ALL CONVERSION RATES ARE SELECTED
  const convert  = () => {
    getRate(convertFrom, convertTo).then(
      rate => parseExchange(exchangeDiv, amount, rate)
    ).catch(
      err => {
        toast(`${convertFrom}-${convertTo} unavailable yet.\n${err}`);
        exchangeDiv.textContent = '';
    })
  }
  //  QUICKLY APPLY CONVERSION RATE CHANGES
  const screenForms = document.querySelectorAll('.screen-forms');
  screenForms.forEach(form => form.onchange = convert);
  
  // Refactor the event handler so as to, 
  // Delegate these events to the container
  const buttons = document.querySelectorAll('.input-btn');
  buttons.forEach(button => {
    button.onclick = () => {
      if(!button.textContent.includes('del'))
        amountDiv.textContent += button.textContent;
      
      else
        amountDiv.textContent = amountDiv.textContent.slice(0, -1);

      amount = amountDiv.textContent;
      
      if(amountDiv.textContent.length < 1)
        return exchange.textContent = '';

      convert();
    };
  });
});


if(navigator.serviceWorker){
  navigator.serviceWorker.register('./sw.js').then(reg => {
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

function getRate  (convertFrom, convertTo) {
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
      url: `https://free.currconv.com/api/v7/convert?q=${convertFrom}_${convertTo}&compact=ultra&apiKey=887c2d2a138031828c49`
    }
  };
  //RATES 'if' CONVERSION RATES ARE NOT YET SELECTED OR 
  //JUST ONE RATE IS SELECTED.
  //if(convertFrom === convertTo || convertFrom === "" || convertTo === "")

  const pair = `${convertFrom}_${convertTo}`
  if(rates[pair])
    return new Promise(resolve(rates[pair]));
  
  return fetch(apis.currconv.url).then(
    response => response.json()
  ).then(
    data => {
      rates[pair] = data[pair];
      return rates[pair];
    }
  )
  //.catch(
  //   error => {
  //     console.log(error);
  //     fetch(api.fixer.endpoints.latest).then(
  //       response => response.json()
  //       ).then(({rates}) => {
  //         console.log(`fixer: ${rates}`);
  //         const val = convertTo.value;
          
  //         exchange.textContent = amount * rates[`${val}`];
  //       });
  //   });
  // }
  .catch(
    err => toast(`Fetching Rates Failed!\n${err}`)
  );
};

function toast(message) {
  console.error(message);
}

function parseExchange(element, amount, value) {
  element.textContent = (value || value == 0) ?  amount * value : ''
}
