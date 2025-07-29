import { ImageConfig } from '../../../../../types/interfaces';
import createHistoryContext from '../../../../core/HistoryContextGeneric';

const context = createHistoryContext<ImageConfig[]>();

const useUnitsHistoryContext = context.useHistoryContext;
const UnitsHistoryProvider = context.HistoryProvider;

export { useUnitsHistoryContext, UnitsHistoryProvider };
