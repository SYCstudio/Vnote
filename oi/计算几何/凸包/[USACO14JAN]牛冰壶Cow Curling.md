# [USACO14JAN]牛冰壶Cow Curling
[BZOJ3428 Luogu3099]

Cow curling is a popular cold-weather sport played in the Moolympics.  
Like regular curling, the sport involves two teams, each of which slides N heavy stones (3 <= N <= 50,000) across a sheet of ice. At the end of the game, there are 2N stones on the ice, each located at a distinct 2D point.  
Scoring in the cow version of curling is a bit curious, however. A stone is said to be "captured" if it is contained inside a triangle whose corners are stones owned by the opponent (a stone on the boundary of such a triangle also counts as being captured). The score for a team is the number of opponent stones that are captured.  
Please help compute the final score of a cow curling match, given the locations of all 2N stones.  
有两支队伍在比赛，一队可以一次取出3个点来，所围成的三角形覆盖的区域可以“捕获”对方的点，问两支队伍各能够捕获对方多少个点。

即求凸包内点的个数，单调栈求出上下凸壳，然后单调地扫一下得到在凸包内的点的数量。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=50100;
const int inf=2147483647;

class Point
{
public:
	int x,y;
};

int n;
Point B[maxN],W[maxN],Up[maxN],Down[maxN];

int Calc();
bool cmp(Point A,Point B);
Point operator + (Point A,Point B);
Point operator - (Point A,Point B);
ll cross(Point A,Point B);
ostream & operator << (ostream &os,Point A);

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d%d",&B[i].x,&B[i].y);
	for (int i=1;i<=n;i++) scanf("%d%d",&W[i].x,&W[i].y);
	sort(&B[1],&B[n+1],cmp);sort(&W[1],&W[n+1],cmp);

	printf("%d ",Calc());
	swap(B,W);
	printf("%d\n",Calc());
	return 0;
}

int Calc(){
	int top1=0,top2=0;
	for (int i=1;i<=n;i++){
		while ((top1>=2)&&(cross(B[i]-Up[top1-1],Up[top1]-Up[top1-1])<=0)) top1--;
		Up[++top1]=B[i];
	}

	for (int i=n;i>=1;i--){
		while ((top2>=2)&&(cross(B[i]-Down[top2],B[i]-Down[top2-1])<=0)) top2--;
		Down[++top2]=B[i];
	}
	reverse(&Down[1],&Down[top2+1]);

	if (Up[1].x==Up[top1].x){
		int ret=0;
		for (int i=1;i<=n;i++) if ((W[i].x==Up[1].x)&&(W[i].y>=Up[1].y)&&(W[i].y<=Up[top1].y)) ret++;
		return ret;
	}

	int p1=0,p2=0,ret=0;
	for (int i=1;i<=n;i++){
		while ((p1!=top1)&&(Up[p1+1].x<=W[i].x)) p1++;
		while ((p2!=top2)&&(Down[p2+1].x<=W[i].x)) p2++;
		if ((p1==0)&&(p2==0)) continue;
		if ((p1==top1)&&(p2==top2)&&(W[i].x!=Up[top1].x)&&(W[i].x!=Down[top2].x)) break;
		bool flag=1;
		if (Up[p1].x==W[i].x){
			if (W[i].y>Up[p1].y) flag=0;
		}
		else if (cross(W[i]-Up[p1],Up[p1+1]-Up[p1])<0) flag=0;
		if (Down[p2].x==W[i].x){
			if (W[i].y<Down[p2].y) flag=0;
		}
		else if (cross(Down[p2+1]-Down[p2],W[i]-Down[p2])<0) flag=0;
		if (flag) ret++;
	}
	return ret;
}

bool cmp(Point A,Point B){
	if (A.x!=B.x) return A.x<B.x;
	return A.y<B.y;
}

Point operator + (Point A,Point B){
	return ((Point){A.x+B.x,A.y+B.y});
}

Point operator - (Point A,Point B){
	return ((Point){A.x-B.x,A.y-B.y});
}

ll cross(Point A,Point B){
	return 1ll*A.x*B.y-1ll*A.y*B.x;
}

ostream & operator << (ostream & os,Point A){
	os<<"("<<A.x<<","<<A.y<<")";return os;
}
```