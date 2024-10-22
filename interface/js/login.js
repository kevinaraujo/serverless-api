document.querySelector("#submit").addEventListener('click', async (e) => {
    const username = document.querySelector('input[name="username"]').value.trim()
    const password = document.querySelector('input[name="password"]').value.trim()

    if (!username || !password) {
        alert('Por favor, preencha todos os campos')
    } else {
        const res = await fetch('https://8yt74v1hll.execute-api.eu-west-1.amazonaws.com/api/login', {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
    
        if (res.ok) {
            const { token } = await res.json()
    
            window.localStorage.setItem('token', token)
            window.location.href = '/'
        } else {
            alert('Usuário ou Senha Inválidos')
        }
    }
})