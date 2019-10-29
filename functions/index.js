// import express from 'express'
// import cors from 'cors'
const functions = require('firebase-functions')
const admin = require('firebase-admin')
// const app = express();

admin.initializeApp(functions.config().firebase)

const db = admin.firestore()

// Random Quest when Create Account
exports.randomQuest = functions.auth.user().onCreate(user => {
  const uid = user.uid

  return randomtoDB(uid)
})

// Random Quest and Store in Firestore
async function randomtoDB(uid) {
  const user = db.collection('users').doc(uid)

  const randomQ1 = Math.floor(Math.random() * 10)
  const randomQ2 = Math.floor(Math.random() * 10)
  const randomQ3 = Math.floor(Math.random() * 10)
  const randomQ4 = Math.floor(Math.random() * 10)

  await user.set({
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

exports.questStatus = functions.https.onCall((data, context) => {
  const uid = context.auth.uid
  const user = db.collection('users').doc(uid)
  user
    .get()
    .then(doc => {
      if (!doc.exists) {
        console.log('No such document!')
      } else {
        console.log('Document data:', doc.data())
        return doc.data()
      }
    })
    .catch(err => {
      console.log('Error getting document', err)
    })
})
