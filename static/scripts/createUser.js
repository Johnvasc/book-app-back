const form = document.getElementById('formCreateUser')
const inputs = document.getElementsByTagName('input')
const div = document.getElementsByClassName('userIdentify')[0]

form.addEventListener('submit', async (event)=>{
  event.preventDefault()
  const data = {username: `${inputs[0].value}`, email: `${inputs[1].value}`, password: `${inputs[2].value}`}
  console.log(data)
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  console.log(options)
  console.log(options.body)
  const res = await fetch('/newAccount', options)
  if(res.status===201){
    window.location.href = '/accountSucess'
  }
  else{

    const textErr = document.createElement('p')
    text = await res.json()
    textErr.innerText = text.msg
    textErr.style.color = 'red'
    textErr.style.textAlign = 'center'
    textErr.style.fontSize = '11px'
    textErr.style.padding = '.1rem'
    div.appendChild(textErr)
  }
})
