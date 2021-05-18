var gulp = require( 'gulp' ),
	$ = require( 'gulp-load-plugins' )(),
	fs = require( 'fs' ),
	browserSync = require( 'browser-sync' ),
	pngquant = require( 'imagemin-pngquant' );


// Sassのタスク
gulp.task( 'sass', function () {

	return gulp.src( [ './assets/scss/**/*.scss' ] )
		.pipe( $.sass( {
			errLogToConsole: true,
			outputStyle: 'compressed',
			sourceComments: 'normal',
			includePaths: [
				'./assets/scss',
				'./node_modules/bootstrap-sass/assets/stylesheets',
			]
		} ) )
		.pipe( gulp.dest( './docs/css' ) );
} );


// Image min
gulp.task( 'imagemin', function () {
	return gulp.src( './assets/img/**/*' )
		.pipe( $.imagemin( {
			progressive: true,
			svgoPlugins: [ { removeViewBox: false } ],
			use: [ pngquant() ]
		} ) )
		.pipe( gulp.dest( './docs/img' ) );
} );

// Jade
gulp.task( 'pug', function () {
	var list = fs.readdirSync( './assets/pug' )
		.filter( function ( file ) {
			return /^[^_].*\.pug$/.test( file );
		} ).map( function ( f ) {
			return f.replace( '.pug', '.html' );
		} );

	return gulp.src( [ './assets/pug/**/*.pug', '!./assets/pug/**/_*.pug' ] )
		.pipe( $.pug( {
			pretty: true,
			locals: {
				list: list
			}
		} ) )
		.pipe( gulp.dest( 'docs' ) );
} );


// watch
gulp.task( 'watch', function () {
	// Make SASS
	gulp.watch( 'assets/scss/**/*.scss', gulp.task( 'sass' ) );
	// Minify Image
	gulp.watch( 'assets/img/src/**/*', gulp.task( 'imagemin' ) );
	// Build Jade
	gulp.watch( 'assets/pug/**/*.pug', gulp.task( 'pug' ) );
	// Browser sync
	gulp.watch( [
		'docs/css/**/*.css',
		'docs/img/**/*',
		'docs/*.html'
	], gulp.task( 'bs-reload' ) );
} );

// Reload Browser sync
gulp.task( 'bs-reload', function () {
	browserSync.reload();
} );


// BrowserSync
gulp.task( 'browser-sync', function () {
	browserSync( {
		server: {
			baseDir: "./docs",     //対象ディレクトリ
			index: "index.html" //インデックスファイル
		},
		reloadDelay: 500,
	} );
} );

// Build
gulp.task( 'build', gulp.parallel( [ 'sass', 'imagemin', 'pug' ] ) );

// Default Tasks
gulp.task( 'default', gulp.parallel( 'browser-sync', 'watch' ) );
