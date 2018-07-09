# [HEOI2013]Segment
[BZOJ3165 Luogu4097]

要求在平面直角坐标系下维护两个操作：

在平面上加入一条线段。记第 i 条被插入的线段的标号为 i
给定一个数 k,询问与直线 x = k 相交的线段中，交点最靠上的线段的编号。

线段树维护完全包含该区间的最高的线。修改的时候，若新线与旧线无交，则直接取更高的，否则取在$mid$处更高的，然后递归交点所在的部分处理。查询的时候要取所有包含该点的线段树区间的最大值。  
注意判断斜率不存在的情况。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
#include<cmath>
using namespace std;

#define ll long long
#define ld long double
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))
#define lson (now<<1)
#define rson (lson|1)

const int maxN=201000;
const int maxNum=40000;
const int Mod=39989;
const int Mod2=1e9;
const int inf=2147483647;
const ld eps=1e-8;
const ld INF=1e18;

class Line
{
public:
	ld k,b;
	ld calc(ld x){
		return k*x+b;
	}
};

int n;
int S[(maxNum+10)<<2];
Line L[maxN];

int Query(int now,int l,int r,int pos);
void Modify(int now,int l,int r,int ql,int qr,int id);
bool Better(int id1,int id2,int x);

int main()
{
	mem(S,0);
	scanf("%d",&n);int linecnt=0,lastans=0;
	while (n--)
	{
		int opt;scanf("%d",&opt);
		if (opt==0)
		{
			int k;scanf("%d",&k);
			k=(k+lastans-1)%Mod+1;
			printf("%d\n",lastans=Query(1,1,maxNum,k));
		}
		if (opt==1)
		{
			int x1,y1,x2,y2;scanf("%d%d%d%d",&x1,&y1,&x2,&y2);
			x1=(x1+lastans-1)%Mod+1;x2=(x2+lastans-1)%Mod+1;
			y1=(y1+lastans-1)%Mod2+1;y2=(y2+lastans-1)%Mod2+1;

			ld k,b;
			if (x1==x2){
				k=0;b=max(y1,y2);
			}
			else{
				k=1.0*(ld)(y1-y2)/(ld)(x1-x2);
				b=y1-(ld)k*(ld)x1;
			}

			L[++linecnt]=((Line){k,b});
			Modify(1,1,maxNum,min(x1,x2),max(x1,x2),linecnt);
		}
	}
	return 0;
}

int Query(int now,int l,int r,int pos)
{
	if (l==r) return S[now];
	int mid=(l+r)>>1;
	int id;
	if (pos<=mid) id=Query(lson,l,mid,pos);
	else id=Query(rson,mid+1,r,pos);

	if (S[now]==0) return id;
	if (id==0) return S[now];
	
	ld y1=L[id].calc(pos),y2=L[S[now]].calc(pos);
	if ((y1>y2)||((fabs(y1-y2)<eps)&&(id<=S[now]))) return id;
	else return S[now];
}

void Modify(int now,int l,int r,int ql,int qr,int id)
{
	if ((l==ql)&&(r==qr))
	{
		if (Better(id,S[now],l)&&Better(id,S[now],r)){
			S[now]=id;return;
		}
		int mid=(l+r)>>1;
		if (Better(id,S[now],mid)) swap(S[now],id);
		if (Better(id,S[now],l)) Modify(lson,l,mid,ql,mid,id);
		if (Better(id,S[now],r)) Modify(rson,mid+1,r,mid+1,qr,id);
		return;
	}
	int mid=(l+r)>>1;
	if (qr<=mid) Modify(lson,l,mid,ql,qr,id);
	else if (ql>=mid+1) Modify(rson,mid+1,r,ql,qr,id);
	else{
		Modify(lson,l,mid,ql,mid,id);Modify(rson,mid+1,r,mid+1,qr,id);
	}
	return;
}

bool Better(int id1,int id2,int x)
{
	ld y1=L[id1].calc(x),y2=L[id2].calc(x);
	if (fabs(y1-y2)<eps) return id1<id2;
	else return y1>y2;
}
```