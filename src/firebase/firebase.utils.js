import firebase from 'firebase/compat/app'
import 'firebase/firestore'
import 'firebase/auth'
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyCSGxfF9-GN7wbNSqajB_kpFjvsrsgWAuo",
    authDomain: "kuis2-pbf-75e3a.firebaseapp.com",
    projectId: "kuis2-pbf-75e3a",
    storageBucket: "kuis2-pbf-75e3a.appspot.com",
    messagingSenderId: "546768622055",
    appId: "1:546768622055:web:3e59d8355991d9ba77ed42",
    measurementId: "G-W5Z0NFV10W"
}

export const createUserProfileDocument = async(userAuth, additionalData) => {
    if (!userAuth) return


    const userRef = firestore.doc(`users/${userAuth.uid}`)
    const snapShot = await userRef.get()
        // console.log(snapShot)


    if (!snapShot.exists) {
        const { displayName, email } = userAuth
        const createdAt = new Date()

        try {
            await userRef.set({
                displayName,
                email,
                createdAt,
                ...additionalData
            })
        } catch (error) {
            console.log("error creating user", error.message)
        }
    }
    return userRef
}

export const addCollectionAndDocuments = async(collectionKey, objectsToAdd) => {
    const collectionRef = firestore.collection(collectionKey)
        // console.log(collectionRef)
    const batch = firestore.batch()
    objectsToAdd.forEach(obj => {
        const newDocRef = collectionRef.doc()
            // console.log(newDocRef)
        batch.set(newDocRef, obj)
    })
    return await batch.commit()
}


export const convertCollectionsSnapshotToMap = (collections) => {
    const transformedCollections = collections.docs.map(doc => {
        const { title, items } = doc.data()

        return {
            routeName: encodeURI(title.toLowerCase()),
            id: doc.id,
            title,
            items
        }
    })
    return transformedCollections.reduce((accumulator, collection) => {
        accumulator[collection.title.toLowerCase()] = collection
        return accumulator
    }, {})
}


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// firebase.initializeApp(config)


export const auth = firebase.auth()
export const firestore = firebase.firestore()

//google authentication

const provider = new firebase.auth.GoogleAuthProvider()
provider.setCustomParameters({ prompt: 'select_account' })

export const signInWithGoogle = () => {
    auth.signInWithPopup(provider)
}

export default firebase