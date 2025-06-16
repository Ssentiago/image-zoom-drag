import { DiagramData } from '../../../../../types/interfaces';
import createHistoryContext from '../../../../core/HistoryContextGeneric';

const context = createHistoryContext<DiagramData[]>();

const useDiagramHistoryContext = context.useHistoryContext;
const DiagramHistoryProvider = context.HistoryProvider;

export { useDiagramHistoryContext, DiagramHistoryProvider };
