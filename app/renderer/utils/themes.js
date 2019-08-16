export async function setTheme(t) {
  let root = document.documentElement

  switch (t) {
    case 'dark':
      root.style.setProperty('--background', '#0D1317')
      root.style.setProperty('--border', '#232323')

      root.style.setProperty('--text', '#E7F8FF')
      root.style.setProperty('--textalt', '#B3B3B3')
      root.style.setProperty('--text-bold', '#FFFFFF')

      root.style.setProperty('--base', '#0E1419')
      root.style.setProperty('--comment', '#FFFA8C')
      root.style.setProperty('--deletion', '#FF2DA8')
      root.style.setProperty('--addition', '#37FFA0')
      root.style.setProperty('--substitute', '#00B5FF')
      root.style.setProperty('--selection', '#6D6540')
      root.style.setProperty('--selection-unfocused', '#444444')

      root.style.setProperty('--button-primary', '#1D262E')
      root.style.setProperty('--positive', '#27FF98')
      root.style.setProperty('--negative', '#FF2DA8')
    break

    case 'light':

      root.style.setProperty('--background', '#FFFFFF')
      root.style.setProperty('--border', '#BDBDBD')

      root.style.setProperty('--text', '#222222')
      root.style.setProperty('--textalt', '#4F4F4F')
      root.style.setProperty('--text-bold', '#000000')

      root.style.setProperty('--button-primary', '#EBEBEB')
      root.style.setProperty('--base', '#EBEBEB')

      root.style.setProperty('--comment', '#B79703')
      root.style.setProperty('--deletion', '#FF4DAC')
      root.style.setProperty('--addition', '#04B151')
      root.style.setProperty('--substitute', '#0A00FF')
      root.style.setProperty('--selection', '#fff189')
      root.style.setProperty('--selection-unfocused', '#fffdb2')

      root.style.setProperty('--button-primary', '#EBEBEB')
      root.style.setProperty('--positive', '#04B151')
      root.style.setProperty('--negative', '#FF2DA8')

    break
  }
}
