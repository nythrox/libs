function reset(fn, then) {
  let mutable = { then };

  fn(
    function shift(inShift, restOfProgram) {
      inShift(program, then);
      function program(val, afterRestOfProgramDone) {
        mutable.then = (restofprogramdonevalue) => {
          afterRestOfProgramDone(restofprogramdonevalue);
        };
        restOfProgram(val);
      }
    },
    (val) => {
      mutable.then(val);
    }
  );
}

reset(function (shift, next) {
  shift(
    (program, done) => {
      program("hello", (res) => {
        program("hello", (res2) => {
          done("!" + res + res2);
        });
      });
    },
    (result) => next(result + "!")
  );
}, console.log);

//  !hello!hello!
