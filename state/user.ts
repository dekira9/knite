import { flow, types } from "mobx-state-tree";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { pick } from 'lodash';

const User = types
  .model({
    id: types.maybe(types.string),
    email: types.maybe(types.string),
    gender: types.maybe(types.string),
    interestedIn: types.maybe(types.string),
    minAge: types.maybe(types.number),
    maxAge: types.maybe(types.number),
    ageRange: types.maybe(types.array(types.number)),
    loading: true,
  })
  .actions((self) => ({
    setUserData(userData) {
      self.id = userData.id || self.id;
      self.email = userData.email || self.email;
      self.gender = userData.gender || self.gender;
      self.interestedIn = userData.interestedIn || self.interestedIn;
      self.minAge = userData.minAge || self.minAge;
      self.maxAge = userData.maxAge || self.maxAge;
      self.loading = false;
      self.persist();
    },
    persist() {
      const user = pick(self, [
        "id",
        "email",
        "gender",
        "interestedIn",
        "minAge",
        "maxAge",
        "loading"
      ]);
      AsyncStorage.setItem("user", JSON.stringify(user));
    },
    loadUserData: flow(function* () {
      try {
        const userData = yield AsyncStorage.getItem("user");
        if (userData) {
          const parsedData = JSON.parse(userData);
          self.setUserData(parsedData);
        }
      } catch (error) {
        console.error("Failed to load user data", error);
      }
    }),
  }));

export default User.create({});