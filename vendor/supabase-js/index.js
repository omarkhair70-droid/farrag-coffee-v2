function result(data = null, error = null) {
  return Promise.resolve({ data, error });
}

function makeInsertBuilder(payload) {
  return {
    select() {
      return {
        single() {
          const row = Array.isArray(payload) ? payload[0] : payload;
          return result(row ?? null, null);
        }
      };
    },
    then(onFulfilled, onRejected) {
      return result(null, null).then(onFulfilled, onRejected);
    }
  };
}

export function createClient() {
  return {
    from() {
      return {
        insert(payload) {
          return makeInsertBuilder(payload);
        }
      };
    }
  };
}
