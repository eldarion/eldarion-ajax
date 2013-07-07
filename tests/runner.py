#!/usr/bin/env python

import os
import sys
import urllib
import optparse

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
CURRENT_DIR = os.path.abspath(os.getcwd())

parser = optparse.OptionParser(
    usage="%prog FILE_OR_URL [filter] [options]",
    description="Run QUnit tests."
)
parser.add_option('--output', metavar='OUT', choices=['console', 'junit', 'tap'],
                  default='console', help='The test output format. [console, junit, tap]] (Default: console)')
parser.add_option('--errorcode', metavar='CODE', type=int, default=0,
                   help='The error code to use when the test fails.')
parser.add_option('--noglobals', action='store_true', default=False,
                    help='Invoke QUnit with the noglobals setting.')
parser.add_option('--notrycatch', action='store_true', default=False,
                    help='Invoke QUnit with the notrycatch setting.')
parser.add_option('--abbrev', action='store_true', default=False,
                    help='Abbreviated console output.')
parser.add_option('--nocolors', action='store_true', default=False,
                    help="Don't use colors in console output.")

def main():
    (options, args) = parser.parse_args()
    
    url_params = {}

    if len(args) < 1:
        parser.print_usage()
        sys.exit(1)

    if len(args) > 1:
        url_params['filter'] = args[1]

    if options.noglobals:
        url_params['noglobals'] = 'true'
    if options.notrycatch:
        url_params['trycatch'] = 'true'

    if '://' in args[0]:
        url = args[0]
    else:
        file_path = os.path.join(CURRENT_DIR, args[0])
        url = "file://%(filepath)s%(args)s" % {
            'filepath': file_path,
            'args': "?%s" % "&".join(("=".join((urllib.quote(k), urllib.quote(v))) for k,v in url_params.items())),
        }

    command = r"""phantomjs %(basepath)s/runner.js "%(url)s" %(output)s %(verbosity)s %(errorcode)s %(usecolor)s""" % {
        'basepath': BASE_PATH,
        'url': url,
        'output': options.output,
        'verbosity': '0' if options.abbrev else '1',
        'errorcode': options.errorcode,
        'usecolor': '1' if not options.nocolors and sys.stdout.isatty() else '0',
    }

    sys.exit(os.system(command))

if __name__ == '__main__':
    main()