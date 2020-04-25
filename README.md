# Google Maps-based road rescue system

This is a Google Maps-based website designed to provide road rescue service in DFW area.
When a traffic accident happens or someone's car breaks down somewhere in the DFW area, the driver may click on the position where the accident occurs to find out if there are fire stations (represented by ![station icon](https://raw.githubusercontent.com/ankouichi/TRL/master/img/station.png)) nearby to call for help. In addition, if there are multiple stations or routes available, show all the options on the left panel, including:

- **fire station info** : *name*, *address*, *number of routes* , *number of remaining trucks*
- **route info** : *estimated time* , *risk factor*

### Concepts
* Point - Any position on the map is a point, it can be marked as a coordinate which contains two properties: longitude and latitude.
* Node - Some specific points that are components of links and routes.
* Segment - A segment is a short straight line between two adjacent points.
* Link - A link is a track between two nodes. It is not a straight line formed by connecting the start node (upstream), end node (downstream) and intermediate points.
* Route - A route contains several links.

### Techniques
 This is a 100% front-end application and no back-end or database techniques are applied. All data comes from the following files:
 * **station.json** - contains all **58** fire stations' info, including: *ID*, *Address*, *ZipCoe*, *StationLongitude*, *StationLatitude*, *X_Coordinate*, *Y_Coordinate*, *ClosestNode* and *StationZone*.
 * **nodes.json** - contains all **5277** nodes' info, including: *ID*, *Address*, *X*, *Y*, *Z* and *Zone*.
 * **links.json** - contains links' info, including: *id*, *upStream*, *downStream*, *directionId* and *points*.
 * **paths.json** - contains all routes' info, including: *LinkID*, *TravelTime*, *TravelRisk* and *Nodes*.

### Implementation
 1. Locate accident position
    Whenever click on the map, capture the coordinate of the point and show the specific icon ![accident](https://raw.githubusercontent.com/ankouichi/TRL/master/img/jiaotongshigu.png) to indicate this is the accident position **A**.
 2. Locate nearby nodes
    1) Draw a circle centered with **A** and radius of 1 mile.
    2) Then iterate the node list to find out all the nodes within the circle. In order to do this, I use Haversine Formula to calculate the spherical distance between two points based on their coordinates.
 3. **Find out routes containing closest segment**
    This is the crucial step. As far as I know, a route consists of several links and a link consists of several segments. In order to find out the target route, it is necessary to find the closest segment first which can be achieved by the following way.

    1) Split all routes obtained in Step 2 into links  
    2) Split these links into segments  
    3) Calculate the distance between **A** and each segment : It is a little tricky here since we need to consider different spatial layout of point and segment.  
    * Point is directly above the segment, the distance will be the **perpendicular** distance. Use *Heron's Formula* to do the calculation.
    * Point is on the left side of the segment
    * Point is on the right side of the segment  

    4) Sort these distances in ascending order, then the first or first few ( since there may be multiple segments have the same distance to **A** ) segments are wanted.

    As long as I get the segment(s), I can trace back which routes contain it(them).
