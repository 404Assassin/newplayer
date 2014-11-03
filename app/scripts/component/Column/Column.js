'use strict';

angular
	.module(
		'Column',
		[ ]
	);

angular
	.module('Column')

	/** @ngInject */
	.controller( 'ColumnController',
		function( $log, $scope, $sce )
		{
			$log.debug( 'Column::scope', $scope );
		}
	)

	/** @ngInject */
	.run(
		function( $log, $rootScope )
		{
			$log.debug('Column::component loaded!');
		}
	);

