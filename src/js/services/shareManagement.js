import site from '../app';

site.service('ShareManagement', (UserStatus, FirebaseURL, $firebaseArray) => {

  const me = UserStatus.authData.uid;

  const manageSorting = (oldSortsPlucked, newSorts, docId) => {
    const newSortsPlucked = _.pluck(newSorts, 'uid');
    const removals = _.difference(oldSortsPlucked, newSortsPlucked);
    const additions = _.difference(newSortsPlucked, oldSortsPlucked);

    _.each(additions, add => {
      const sharebase = $firebaseArray(new Firebase(`${FirebaseURL}/shares/${add}/${me}`));
      sharebase.$loaded().then(() => {
        sharebase.$add(docId);
      });
    });

    _.each(removals, rem => {
      const sharebase = $firebaseArray(new Firebase(`${FirebaseURL}/shares/${rem}/${me}`));
      sharebase.$loaded().then(() => {
        const item = _.findWhere(sharebase, { $value: docId });
        console.log(item, sharebase.$keyAt(item.$id), sharebase.$indexFor(item.$id));
        sharebase.$remove(sharebase.$indexFor(item.$id));
      });
    });
  };

  return {
    manageSorting
  };

});