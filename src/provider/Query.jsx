import { QueryClient, QueryClientProvider } from "react-query";
import PropTypes from "prop-types";

const queryClient = new QueryClient();

export default function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

QueryProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
