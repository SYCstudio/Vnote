# [ZJOI2008]泡泡堂BNB
[BZOJ1034 Luogu2587]

第XXXX届NOI期间，为了加强各省选手之间的交流，组委会决定组织一场省际电子竞技大赛，每一个省的代表队由n名选手组成，比赛的项目是老少咸宜的网络游戏泡泡堂。每一场比赛前，对阵双方的教练向组委会提交一份参赛选手的名单，决定了选手上场的顺序，一经确定，不得修改。比赛中，双方的一号选手，二号选手……，n号选手捉对厮杀，共进行n场比赛。每胜一场比赛得2分，平一场得1分，输一场不得分。最终将双方的单场得分相加得出总分，总分高的队伍晋级(总分相同抽签决定)。  
作为浙江队的领队，你已经在事先将各省所有选手的泡泡堂水平了解的一清二楚，并将其用一个实力值来衡量。为简化问题，我们假定选手在游戏中完全不受任何外界因素干扰，即实力强的选手一定可以战胜实力弱的选手，而两个实力相同的选手一定会战平。由于完全不知道对手会使用何种策略来确定出场顺序，所以所有的队伍都采取了这样一种策略，就是完全随机决定出场顺序。  
当然你不想这样不明不白的进行比赛。你想事先了解一下在最好与最坏的情况下，浙江队最终分别能得到多少分。

田忌赛马，先比较小的，再比较大的，最后用最差的取抵消最好的。

```cpp
#include<iostream>
#include<cstdio>
#include<cstdlib>
#include<cstring>
#include<algorithm>
using namespace std;

#define ll long long
#define mem(Arr,x) memset(Arr,x,sizeof(Arr))

const int maxN=101000;
const int inf=2147483647;

int n;
int A[maxN],B[maxN];

int GetAns();

int main(){
	scanf("%d",&n);
	for (int i=1;i<=n;i++) scanf("%d",&A[i]);
	for (int i=1;i<=n;i++) scanf("%d",&B[i]);

	sort(&A[1],&A[n+1]);sort(&B[1],&B[n+1]);

	printf("%d ",GetAns());
	swap(A,B);
	printf("%d\n",2*n-GetAns());

	return 0;
}

int GetAns(){
	int get=0;
	int p1=1,p2=n,p3=1,p4=n;
	while ((p1<=p2)&&(p3<=p4)){
		if (A[p1]>B[p3]) p1++,p3++,get+=2;
		else if (A[p2]>B[p4]) p2--,p4--,get+=2;
		else get+=A[p1]==B[p4],p1++,p4--;
	}
	return get;
}
```