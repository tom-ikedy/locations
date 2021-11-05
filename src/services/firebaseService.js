import firebase from 'firebase/app';

const noImageURL = 'https://firebasestorage.googleapis.com/v0/b/tsukamoto-locations.appspot.com/o/NO_IMAGE.png?alt=media&token=39769e2f-6a7d-49f6-97ad-b09f024603db';

export const uploadShopImage = async (userid, shopid, fileData) => {
  // Storageに画像をアップロード
  const fileName = userid.concat('/', shopid);

  await firebase
    .storage()
    .ref(fileName)
    .put(fileData) // ファイルアップロードを実行
    .then((snapshot) => {
      // アップロード処理に成功したときの処理
      console.log(snapshot);
    })
    .catch((error) => {
      // アップロード処理に失敗したときの処理
      console.error('ファイルアップロードエラー', error);
    });
};

export const getShopImageURL = async (userid, shopid) => {
  // Storageの画像のURLを取得する
  const fileName = userid.concat('/', shopid);
  let url = '';

  await firebase
    .storage()
    .ref(fileName)
    .getDownloadURL()
    .then((res) => {
      url = res;
    })
    .catch((error) => {
      console.log(error);
    });

  return url;
};

export const delShopImage = async (userid, shopid) => {
  // Storageの画像を削除する
  const fileName = userid.concat('/', shopid);

  await firebase
    .storage()
    .ref(fileName)
    .delete() // ファイル削除を実行
    .catch((error) => {
      // 削除処理に失敗したときの処理
      console.error('ファイル削除エラー', error);
    });
};

export const getShops = async (userid) => {
  // Firestoreのお店情報一覧を取得する
  const shopsSnapshot = await firebase.firestore().collection(userid).orderBy('name').get();
  const { docs } = shopsSnapshot;
  const shops = [];

  for (let i = 0; i < docs.length; i += 1) {
    const doc = docs[i];
    const { name, memo, imageURL } = doc.data();
    const shopid = doc.id;
    shops.push({
      shopid,
      name,
      memo,
      imageURL,
    });
  }

  return shops;
};

export const addShopData = async (userid, shopData) => {
  // お店情報を追加する
  let shopid = '';
  let imageURL = noImageURL;
  const colRef = firebase.firestore().collection(userid);

  // Firestoreに追加する
  await colRef.add({
    name: shopData.name,
    memo: shopData.memo,
  })
    .then((docRef) => {
      shopid = docRef.id;
    })
    .catch((error) => {
      console.error('Error adding document: ', error);
    });

  // 写真が選択されている場合、Storageに写真をアップロード
  if (shopData.fileData !== '') {
    await uploadShopImage(userid, shopid, shopData.fileData);
    imageURL = await getShopImageURL(userid, shopid);
  }

  // アップロードした写真のURLをFirestoreにアップロード
  const docRef = firebase.firestore().collection(userid).doc(shopid);
  await docRef.update({
    imageURL,
  })
    .catch((error) => {
      console.error('Error update document: ', error);
    });
};

export const updateShopData = async (userid, shopid, shopData) => {
  // お店情報を更新する
  let imageURL = '';
  const docRef = firebase.firestore().collection(userid).doc(shopid);

  // 写真が選択されている場合、Storageに写真をアップロード
  if (shopData.fileData !== '') {
    await uploadShopImage(userid, shopid, shopData.fileData);
    imageURL = await getShopImageURL(userid, shopid);
  } else {
    imageURL = shopData.imageURL;
  }

  // Firestoreのお店情報を更新する
  await docRef.update({
    name: shopData.name,
    memo: shopData.memo,
    imageURL,
  })
    .catch((error) => {
      console.error('Error update document: ', error);
    });
};

export const getShopData = async (userid, shopid) => {
  // お店情報を取得する
  const docRef = await firebase.firestore().collection(userid).doc(shopid);
  const shopData = {};

  // Firestoreのお店情報を取得する
  await docRef.get().then((doc) => {
    if (doc.exists) {
      const { name, memo, imageURL } = doc.data();
      shopData.name = name;
      shopData.memo = memo;
      shopData.imageURL = imageURL;
    } else {
      // doc.data() will be undefined in this case
      console.log('No such document!');
    }
  }).catch((error) => {
    console.log('Error getting document:', error);
  });

  return shopData;
};

export const delShopData = async (userid, shopid) => {
  // お店情報を削除する
  let delURL = '';
  const docRef = firebase.firestore().collection(userid).doc(shopid);

  await docRef.get()
    .then((doc) => {
      if (doc.exists) {
        const { imageURL } = doc.data();
        delURL = imageURL;
      } else {
        console.log('No such document');
      }
    })
    .catch((error) => {
      console.error('Error getting document:', error);
    });

  if (delURL !== noImageURL) {
    await delShopImage(userid, shopid);
  }

  await docRef.delete()
    .catch((error) => {
      console.error('Error delete document: ', error);
    });
};

export const addAccount = async (usermail, userpass) => {
  const regErrorMessage = `
  アカウント登録に失敗しました。
    ・アカウントが既に使用されている可能性があります。
    ・パスワードは6文字以上を指定してください。
  `;
  let userid = '';

  await firebase
    .auth()
    .createUserWithEmailAndPassword(usermail, userpass)
    .then((userCredential) => {
      userid = userCredential.user.uid;
      console.log('アカウント登録成功', userid);
    })
    .catch((error) => {
      alert(regErrorMessage);
      console.error('アカウント登録に失敗しました', error);
    });

  return userid;
};

export const deleteAccount = async (userid) => {
  // Storage削除
  await firebase.storage().ref(userid).listAll()
    .then((res) => {
      res.items.forEach((itemRef) => {
        itemRef.delete()
          .catch((error) => {
            console.error('Error deleting file:', error);
          });
      });
    })
    .catch((error) => {
      console.error(error);
    });

  // firestore削除
  await firebase.firestore().collection(userid).get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
        doc.ref.delete()
          .catch((error) => {
            console.error('Error delete document: ', error);
          });
      });
    })
    .catch((error) => {
      console.error(error);
    });

  // auth削除
  await firebase.auth().currentUser.delete()
    .then(() => {
      console.log('Deleting user success!');
    })
    .catch((error) => {
      console.error('Error deleting user:', error);
    });
};
