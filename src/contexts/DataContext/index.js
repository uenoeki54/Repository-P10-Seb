import PropTypes from 'prop-types';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const DataContext = createContext({});

export const api = {
  loadData: async () => {
    const json = await fetch('/events.json');
    return json.json();
  },
};

export const DataProvider = ({ children }) => {
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [last, setLast] = useState(null);
  const getData = useCallback(async () => {
    try {
      setData(await api.loadData());
    } catch (err) {
      setError(err);
    }
  }, []);
  useEffect(() => {
    if (data) return;
    getData();
  });

  useEffect(() => {
    const byDateDesc = data?.events.sort((evtA, evtB) =>
      new Date(evtA.date) > new Date(evtB.date) ? -1 : 1
    );
    if (byDateDesc) {
      setLast(byDateDesc[0]);
    }
  }, [data]);
  return (
    <DataContext.Provider
      // eslint-disable-next-line react/jsx-no-constructed-context-values
      value={{
        data,
        error,
        last,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useData = () => useContext(DataContext);
console.log(`valeur de useData ${useData}`);

export default DataContext;
