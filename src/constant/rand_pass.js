function randPass() {
  let pass = Math.random().toString(36).slice(2, 8)

  return pass;
}


module.exports = randPass


