import React from 'react';
import { Table, Input, Pagination, Dropdown, Popup, Icon, Button } from 'semantic-ui-react';

import { IConfigSortData, IResultSortDataBy, sortDataBy } from '../utils/datasort';
import { useStateWithStorage } from '../utils/storage';

import * as SearchString from 'search-string';

const filterTypeOptions = [
	{ key: '0', value: 'Exact', text: 'Exact match only' },
	{ key: '1', value: 'Whole word', text: 'Whole word only' },
	{ key: '2', value: 'Any match', text: 'Match any text' }
];

const pagingOptions = [
	{ key: '0', value: '10', text: '10' },
	{ key: '1', value: '25', text: '25' },
	{ key: '2', value: '50', text: '50' },
	{ key: '3', value: '100', text: '100' }
];

export interface ITableConfigRow {
	width: number;
	column: string;
	title: string;
	pseudocolumns?: string[];
}

type SearchableTableProps = {
	id?: string;
	data: any[];
	explanation?: React.ReactNode;
	config: ITableConfigRow[];
	renderTableRow: (row: any, idx?: number) => JSX.Element;
	filterRow: (crew: any, filter: any, filterType?: string) => boolean;
	showFilterOptions: boolean;
};

export const SearchableTable = (props: SearchableTableProps) => {
	let data = [...props.data];
	const tableId = props.id ? props.id : '';

	// Ignore stored searchFilter if search parameter found
	let defaultSearch = '', useAndStoreDefault = false;

	if (typeof window !== "undefined") {
		let urlParams = new URLSearchParams(window.location.search);
		if (urlParams.has('search')) {
			defaultSearch = urlParams.get('search');
			useAndStoreDefault = true;
		}
	}

	const [searchFilter, setSearchFilter] = useStateWithStorage(tableId + 'searchFilter', defaultSearch, { useAndStoreDefault });
	const [filterType, setFilterType] = useStateWithStorage(tableId + 'filterType', 'Any match');
	const [column, setColumn] = useStateWithStorage(tableId + 'column', null);
	const [direction, setDirection] = useStateWithStorage(tableId + 'direction', null);
	const [pagination_rows, setPaginationRows] = useStateWithStorage(tableId + 'paginationRows', 10);
	const [pagination_page, setPaginationPage] = useStateWithStorage(tableId + 'paginationPage', 1);

	// We only sort here to store requested column and direction in state
	//	Actual sorting of full dataset will occur on next render before filtering and pagination
	function handleSort(clickedColumn, pseudocolumns) {
		const sortConfig: IConfigSortData = {
			field: clickedColumn,
			direction: direction
		};

		if (pseudocolumns) {
			if (pseudocolumns.includes(column)) {
				sortConfig.field = column;
			} else {
				sortConfig.direction = null;
			}
			sortConfig.rotateFields = pseudocolumns;
		} else {
			if (clickedColumn !== column) {
				// sort rarity and skills descending first by default
				sortConfig.direction = 'ascending';
			}
		}

		const sorted: IResultSortDataBy = sortDataBy(data, sortConfig);

		setColumn(sorted.field);
		setDirection(sorted.direction);
		setPaginationPage(1);
	}

	function onChangeFilter(value) {
		setSearchFilter(value);
		setPaginationPage(1);
	}

	function renderTableHeader(column: any, direction: 'descending' | 'ascending' | null): JSX.Element {
		return (
			<Table.Row>
				{props.config.map((cell, idx) => (
					<Table.HeaderCell
						key={idx}
						width={cell.width as any}
						sorted={((cell.pseudocolumns && cell.pseudocolumns.includes(column)) || (column === cell.column)) ? direction : null}
						onClick={() => handleSort(cell.column, cell.pseudocolumns)}
					>
						{cell.title}{cell.pseudocolumns?.includes(column) && <><br /><small>{column}</small></>}
					</Table.HeaderCell>
				))}
			</Table.Row>
		);
	}

	// Sorting
	if (column) {
		const sortConfig: IConfigSortData = {
			field: column,
			direction: direction,
			keepSortOptions: true
		};
		// Use original dataset for sorting
		const sorted: IResultSortDataBy = sortDataBy([...props.data], sortConfig);
		data = sorted.result;
	}

	// Filtering
	let filters = [];
	if (searchFilter) {
		let grouped = searchFilter.split(/\s+OR\s+/i);
		grouped.forEach(group => {
			filters.push(SearchString.parse(group));
		});
	}
	data = data.filter(row => props.filterRow(row, filters, filterType));

	// Pagination
	let activePage = pagination_page;
	let totalPages = Math.ceil(data.length / pagination_rows);
	if (activePage > totalPages) activePage = totalPages;
	data = data.slice(pagination_rows * (activePage - 1), pagination_rows * activePage);

	const isMobile = false; //TODO?

	return (
		<div>
			<Input
				style={{ width: isMobile ? '100%' : '50%' }}
				iconPosition="left"
				placeholder="Search..."
				value={searchFilter}
				onChange={(e, { value }) => onChangeFilter(value)}>
				<input />
				<Icon name='search' />
				<Button icon onClick={() => onChangeFilter('')} >
					<Icon name='delete' />
				</Button>
			</Input>

			{props.showFilterOptions && (
				<span style={{ paddingLeft: '2em' }}>
					<Dropdown inline
						options={filterTypeOptions}
						value={filterType}
						onChange={(event, { value }) => setFilterType(value as number)}
					/>
				</span>
			)}

			<Popup wide trigger={<Icon name="help" />}
				header={'Advanced search'}
				content={props.explanation ? props.explanation : renderDefaultExplanation()}
			/>

			<Table sortable celled selectable striped collapsing unstackable compact="very">
				<Table.Header>{renderTableHeader(column, direction)}</Table.Header>
				<Table.Body>{data.map((row, idx) => props.renderTableRow(row, idx))}</Table.Body>
				<Table.Footer>
					<Table.Row>
						<Table.HeaderCell colSpan={props.config.length}>
							<Pagination
								totalPages={totalPages}
								activePage={activePage}
								onPageChange={(event, { activePage }) => setPaginationPage(activePage as number)}
							/>
							<span style={{ paddingLeft: '2em' }}>
								Rows per page:{' '}
								<Dropdown
									inline
									options={pagingOptions}
									value={pagination_rows}
									onChange={(event, { value }) => {
										setPaginationPage(1);
										setPaginationRows(value as number);
									}}
								/>
							</span>
						</Table.HeaderCell>
					</Table.Row>
				</Table.Footer>
			</Table>
		</div>
	);
}

function renderDefaultExplanation() {
	return (
		<div>
			<p>
				Search for characters by name or tag (with optional '-' for exclusion). For example, <b>TODO: examples</b>
			</p>
		</div>
	);
}
