// import express from 'express'
// import cors from 'cors'
const functions = require('firebase-functions')
const admin = require('firebase-admin')
// const app = express();
const FieldValue = require('firebase-admin').firestore.FieldValue

const serviceAccount = require('./utils/mumsp-op2019-firebase-adminsdk-01vw1-70bfbbbf11.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://mumsp-op2019.firebaseio.com',
})

const db = admin.firestore()

// Random Quest when Create Account
exports.randomQuest = functions.auth.user().onCreate(user => {
  const uid = user.uid
  const email = user.email // The email of the user.
  const Name = user.displayName // The display name of the user.
  const photo = user.photoURL

  return randomtoDB(uid, email, Name, photo)
})

// Random Quest and Store in Firestore
async function randomtoDB(uid, email, Name, photo) {
  const user = db.collection('users').doc(uid)

  const nQ1 = 14
  const nQ2 = 1
  const nQ3 = 15
  const nQ4 = 7
  const randomQ1 = Math.floor(Math.random() * (nQ1 - 1) + 1)
  const randomQ2 = Math.floor(Math.random() * (nQ2 - 1) + 1)
  const randomQ3 = Math.floor(Math.random() * (nQ3 - 1) + 1)
  const randomQ4 = Math.floor(Math.random() * (nQ4 - 1) + 1)

  await user.set({
    name: Name,
    email: email,
    photo: photo + '?width=1000&height=1000',
    rQ1: randomQ1,
    rQ2: randomQ2,
    rQ3: randomQ3,
    rQ4: randomQ4,
    Q1status: false,
    Q2status: false,
    Q3status: false,
    Q4status: false,
  })

  console.log('Finish Random Quest for ' + uid)
}

// Quest Status in Quest Menu Page
exports.questStatus = functions.https.onCall((data, context) => {
  const uid = context.auth.uid
  const name = context.auth.token.name || null
  // console.log('UID: ' + uid)

  const user = db
    .collection('users')
    .doc(uid)
    .get()
  return user
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!')
        return { result: 'No Docs' }
      } else {
        const Qstatus = {
          name: name,
          Q1status: doc.data().Q1status,
          Q2status: doc.data().Q2status,
          Q3status: doc.data().Q3status,
          Q4status: doc.data().Q4status,
        }
        // const status = doc.data()
        // console.log(status)
        return Qstatus
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })
})

/* Quest 1 */
// Q1 Question - Query Question for Stage 1
exports.Q1question = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  // console.log('UID: ' + uid)

  const rQ1 = await quest1rQuery(uid)
  // console.log('a=',rQ1);

  //return quest1rQuery(uid)

  return quest1qQuery(rQ1)
})

// Q1 Query Random Question Number
async function quest1rQuery(uid) {
  const user = db
    .collection('users')
    .doc(uid)
    .get()
  return user.then(doc => {
    const q1r = doc.data().rQ1
    // console.log('q1r = ', q1r)
    return q1r
  })
}

// Q1 Query Question from Q Number
async function quest1qQuery(rQ1) {
  console.log('rQ1 = ', rQ1)
  const quest1no = db.doc('quest/stage1/qa/' + rQ1).get()
  return quest1no.then(doc => {
    // console.log(doc.data())
    const question = {
      question: doc.data().question,
      choiceA: doc.data().choiceA,
      choiceB: doc.data().choiceB,
      choiceC: doc.data().choiceC,
      choiceD: doc.data().choiceD,
    }
    // console.log(question)
    return question
  })
}

// Check Answer Q1
exports.Q1check = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  const userans = data.userans
  // console.log('UID: ' + uid)

  // User's Random Q Number
  const rQ1 = await quest1rQuery(uid)
  // Q1 Answer from DB
  const Q1ans = await quest1ansQuery(rQ1)
  //return quest1rQuery(uid)

  if (userans === Q1ans) {
    user = db.collection('users').doc(uid)
    user.update({ Q1status: true, Q1timestamp: FieldValue.serverTimestamp() })
    return true
  } else {
    return false
  }
})

// Q1 Query Answer from Q Number
async function quest1ansQuery(rQ1) {
  console.log('rQ1 = ', rQ1)
  const quest1no = db.doc('quest/stage1/qa/' + rQ1).get()
  return quest1no.then(doc => {
    // console.log(doc.data())
    const answer = doc.data().answer
    // console.log(question)
    return answer
  })
}

/* Quest 2 */
// Q2 Question - Query Question for Stage 1
exports.getMissionQ2 = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  // console.log('UID: ' + uid)

  const rQ2 = await quest2rQuery(uid)
  // console.log('a=',rQ1);

  //return quest1rQuery(uid)

  return quest2qQuery(rQ2)
})

// Q2 Query Random Question Number
async function quest2rQuery(uid) {
  const user = db
    .collection('users')
    .doc(uid)
    .get()
  return user.then(doc => {
    const q2r = doc.data().rQ2
    // console.log('q1r = ', q1r)
    return q2r
  })
}

// Q2 Query Question from Q Number
async function quest2qQuery(rQ2) {
  console.log('rQ2 = ', rQ2)
  const quest2no = db.doc('quest/stage2/mission/' + rQ2).get()
  return quest2no.then(doc => {
    // console.log(doc.data())
    const mission = doc.data().mission
    // console.log(question)
    return mission
  })
}

/* Quest 3 */
// Q3 Question - Query Question for Stage 1
exports.getMissionQ3 = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  // console.log('UID: ' + uid)

  const rQ3 = await quest3rQuery(uid)
  // console.log('a=',rQ1);

  //return quest1rQuery(uid)

  return quest3qQuery(rQ3)
})

// Q3 Query Random Question Number
async function quest3rQuery(uid) {
  const user = db
    .collection('users')
    .doc(uid)
    .get()
  return user.then(doc => {
    const q3r = doc.data().rQ3
    // console.log('q1r = ', q1r)
    return q3r
  })
}

// Q3 Query Question from Q Number
async function quest3qQuery(rQ3) {
  console.log('rQ3 = ', rQ3)
  const quest3no = db.doc('quest/stage3/mission/' + rQ3).get()
  return quest3no.then(doc => {
    // console.log(doc.data())
    const mission = doc.data().mission
    // console.log(question)
    return mission
  })
}

/* Quest 4 */
// Q4 Question - Query Question for Stage 1
exports.getMissionQ4 = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  // console.log('UID: ' + uid)

  const rQ4 = await quest4rQuery(uid)
  // console.log('a=',rQ1);

  //return quest1rQuery(uid)

  return quest4qQuery(rQ4)
})

// Q4 Query Random Question Number
async function quest4rQuery(uid) {
  const user = db
    .collection('users')
    .doc(uid)
    .get()
  return user.then(doc => {
    const q4r = doc.data().rQ4
    // console.log('q1r = ', q1r)
    return q4r
  })
}

// Q4 Query Question from Q Number
async function quest4qQuery(rQ4) {
  console.log('rQ4 = ', rQ4)
  const quest4no = db.doc('quest/stage4/mission/' + rQ4).get()
  return quest4no.then(doc => {
    // console.log(doc.data())
    const mission = doc.data().mission
    // console.log(question)
    return mission
  })
}

// Check Unlock Code
exports.unlockcode = functions.https.onCall(async (data, context) => {
  const uid = context.auth.uid
  const stageno = data.stage
  const usercode = data.usercode
  console.log('UID: ' + uid)

  // Unlock Code from DB
  const unlockcode = await getUnlockCode(stageno)
  //return quest1rQuery(uid)

  const user = db.collection('users').doc(uid)

  if (usercode === unlockcode) {
    if (stageno === '2') {
      user.update({ Q2status: true, Q2timestamp: FieldValue.serverTimestamp() })
    } else if (stageno === '3') {
      user.update({ Q3status: true, Q3timestamp: FieldValue.serverTimestamp() })
    } else if (stageno === '4') {
      user.update({ Q4status: true, Q4timestamp: FieldValue.serverTimestamp() })
    }
    return true
  } else {
    return false
  }
})

// Query Stage Unlock Code
async function getUnlockCode(stageno) {
  const stagename = 'stage' + stageno
  console.log(stagename)
  const unlockcode = db
    .collection('quest')
    .doc(stagename)
    .get()
  return unlockcode.then(doc => {
    console.log(doc.data())
    const Code = doc.data().unlockcode
    console.log(Code)
    return Code
  })
}
