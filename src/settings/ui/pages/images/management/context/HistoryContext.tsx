import { UnitConfig } from '../../../../../types/interfaces';
import createHistoryContext from '../../../../core/HistoryContextGeneric';

const context = createHistoryContext<UnitConfig[]>();

const useUnitsHistoryContext = context.useHistoryContext;
const UnitsHistoryProvider = context.HistoryProvider;

export { useUnitsHistoryContext, UnitsHistoryProvider };
