export default async function bot(): Promise<void> {
  console.log("Hi, I'm a script that just wait 2 seconds but could do anything.")
  await new Promise<void>((resolve) =>
    setTimeout(() => {
      console.log('Goodbye')
      resolve()
    }, 2000)
  )
}
