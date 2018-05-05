
class A {
  @speak
  run(){
    console.log('run')
  }
}




function speak(target,key){
  console.log(arguments)
}