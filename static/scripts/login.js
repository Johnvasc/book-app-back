const form = document.getElementById('loginForm')
const inputs = document.getElementsByTagName('input')
const div = document.getElementsByClassName('userIdentify')[0]

form.addEventListener('submit', async (event)=>{
  event.preventDefault()
  const data = {email: `${inputs[0].value}`, password: `${inputs[1].value}`}
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }
  const res = await fetch('/', options)
  if(res.status===404){
    const textErr = document.createElement('p')
    text = await res.json()
    textErr.innerText = text.msg
    textErr.style.color = 'red'
    textErr.style.textAlign = 'center'
    textErr.style.fontSize = '11px'
    textErr.style.padding = '.1rem'
    div.appendChild(textErr)
  }else if(res.status===200){
    window.location.href = '/home'
  }
})
